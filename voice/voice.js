const { bold } = require('discord.js');
const { EndBehaviorType, VoiceConnectionStatus } = require("@discordjs/voice");
const { OpusEncoder } = require("@discordjs/opus");
const ffmpegStatic = require('ffmpeg-static');
const { spawn } = require("child_process");
var fs = require('fs');
var path = require("path");
var MusicPlayer = require("../commands/music/MusicPlayer");
const botDefaultTextChannelID = process.env.TEXT_CHANNEL_ID;

class Bob {

  static instance = null;

  constructor(Client, data, connection) {
    this.receiver = connection.receiver; // <- Audio receiver.
    this.speakers = new Set();           // <- People currently being listened to.

    // We remove the listeners to use the own function.
    this.receiver.speaking.removeAllListeners();

    this.receiver.speaking.on("start", async userId => {
      const user = await Client.users.fetch(userId);
      if (user && !user.bot) this.#listen(Client, connection, userId, user.displayName);
    });

    // AI
    this.init();

    // music player
    MusicPlayer.init();
    connection.subscribe(MusicPlayer.player);


    // singleton
    if (Bob.instance === null) {
      Bob.instance = this;
    } else {
      throw new Error("There is already a running instance of Bob!");
    }
  }

  /**     * Transcribes audio received from a certain user, as long as it is not a bot, has a supported role and is not being listened to previously.
  * @param { import( "discord.js" ).Client } Client The Discord client.
  * @param { Object } data The data obtained previously.
  * @param { String } userId The ID of the user to listen to.
  */
  async #listen(Client, connection, userId, username) {

    // Classes and functions to use.
    // const { DatabaseManager } = Client; 
    // const { Embeds, Guild, channel, guild } = data;

    // Subscription between bot and user
    let subscription = this.receiver.subscribe(userId, {
      end: {
        behavior: EndBehaviorType.AfterSilence,
        duration: 500
      }
    });

    // Received audio data buffer.
    const bufferArr = [];
    const encoder = new OpusEncoder(48000, 2);

    subscription.on("data", chunk => { bufferArr.push(encoder.decode(chunk)) });
    subscription.once("end", async () => {
      // TODO
      const bufferOut = Buffer.concat(bufferArr);
      // console.log(bufferOut)
      await this.saveAudio(bufferOut, userId);
      if (!this.processingId.has(userId)){
        if (!this.isListeningToCommand) await this.predictWakeWord(userId, username);
        else if (this.commanderId == userId) await this.predictVoiceCommand(Client, connection, userId, username);    
      }
    });
  }



  //
  //
  //
  // ASR functions
  //
  //
  //

  init() {    
    this.speakerIdx = "p230";
    this.language = "English";
    this.isListeningToCommand = false;
    this.isProcessing = false;
    this.wakeWord = new Set(['hey, bob.', 'hey bob.', 'hey bob', 'hey, bob']);
    this.commanderId = null;
    this.processingId = new Set();
    this.commands = [];
    // Grab all the command folders from the commands directory you created earlier
    const foldersPath = path.join(__dirname, 'commands');
    const commandFolders = fs.readdirSync(foldersPath);
    for (const folder of commandFolders) {
      // Grab all the command files from the commands directory you created earlier
      const commandsPath = path.join(foldersPath, folder);
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
      // Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('names' in command && 'execute' in command) {
          this.commands.push(command);
        } else {
          console.log(`[WARNING] The command at ${filePath} is missing a required "names" or "execute" property.`);
        }
      }
    }
  }

  getLang(){
    return this.language;
  }

  setLang(language) {
    this.language = language;
  }

  setVolume(vol){
    this.volume = vol;
    MusicPlayer.volume = vol;
  }

  setSpeakerIdx(idx){
    this.speakerIdx = idx;
  }

  async saveAudio(buffer, userId) {
    // audio file
    const filename = `voice/${userId}.mp3`;
    const ffmpegProcess = spawn(ffmpegStatic, [
      '-y',
      '-f', 's16le',
      '-ar', '48000',
      '-ac', '2',
      '-i', '-',
      '-codec:a', 'libmp3lame',
      filename,
    ]);

    ffmpegProcess.stdin.write(buffer, 'binary');
    ffmpegProcess.stdin.end();

    // DEBUG
    // ffmpegProcess.on('close', (code) => {
    //   if (code === 0) {
    //     // console.log('MP3 file saved:', filename);
    //   } else {
    //     console.error(`Error during MP3 conversion. Exit code: ${code}`);
    //   }
    //   ffmpegProcess.kill();
    // });
    // ffmpegProcess.on('error', (err) => {
    //   console.error('ffmpeg process error:', err);
    // });

    // ffmpegProcess.stdout.on('data', (data) => {
    //   console.log(`ffmpeg stdout: ${data}`);
    // });
    // ffmpegProcess.stderr.on('data', (data) => {
    //   console.error(`ffmpeg stderr: ${data}`);
    // });
  }

  async predictWakeWord(userId, username) {
    this.isProcessing = true;
    this.processingId.add(userId);
    const whisperProcess = spawn("whisper", [
      "--model", "tiny",
      "--output_dir", "./voice/transcript",
      "--device", "cuda",
      "--language", "en",
      "-f", "json",
      `voice/${userId}.mp3`
    ]);
    whisperProcess.on('close', (code) => {
      if (code === 0) {
        // console.log(`Exit code: ${code}`);
        const data = JSON.parse(fs.readFileSync(`./voice/transcript/${userId}.json`));
        const result = data.text.trim().toLowerCase();
        if (this.wakeWord.has(result)) {
          // wake word met
          this.commanderId = userId;
          this.isListeningToCommand = true;
          MusicPlayer.audio("listening.mp3");
        }
        console.log(`${userId} wake: ` + result);
      } else {
        this.isListeningToCommand = false;
        console.error(`Whisper exec error. Exit code: ${code}`);
      }
      this.isProcessing = false;
      this.processingId.delete(userId);
      whisperProcess.kill();
    });
  }

  async predictVoiceCommand(client, connection, userId, username) {
    this.isProcessing = true;
    this.processingId.add(userId);
    const whisperProcess = spawn("whisper", [
      "--model", "small",
      "--output_dir", "./voice/transcript",
      "--device", "cuda",
      "--language", this.language,
      "-f", "json",
      `voice/${userId}.mp3`
    ]);

    whisperProcess.on('close', (code) => {
      if (code === 0) {
        // console.log(`Exit code: ${code}`);
        const data = JSON.parse(fs.readFileSync(`./voice/transcript/${userId}.json`));
        const result = data.text.trim().toLowerCase();
        console.log(`${userId} command: ` + result);

        const command = this.getCommand(result, this.commands);
        if (command.command) {
          const params = {
            client,
            connection,
            input: result,
            username,
            commandName: command.commandName,
          }
          command.command.execute(params);
          this.isListeningToCommand = false;
        } else {
          this.gpt(client, result, username);
        }
      } else {
        this.isListeningToCommand = false;
        console.error(`Whisper exec error. Exit code: ${code}`);
      }
      // reset vars when command is over
      this.isProcessing = false;
      this.processingId.delete(userId);
      whisperProcess.kill();
    });
    // whisperProcess.on('error', (err) => {
    //   console.error('whisper process error:', err);
    // });
    // whisperProcess.stderr.on('data', (data) => {
    //   console.error(`whisper stderr: ${data}`);
    // });
  }

  async speak(text){
    const ttsProcess = spawn("tts", [
      "--model_name", "tts_models/en/vctk/vits",
      "--use_cuda", "true",
      "--speaker_idx", this.speakerIdx,
      "--text", `"${text}"`,
      "--out_path", "/root/DiscordBob/voice/bob.mp3"
    ]);
    ttsProcess.on('close', (code) => {
      if (code === 0) {
        MusicPlayer.speak();
      } else {
        console.error(`TTS exec error. Exit code: ${code}`);
      }
      ttsProcess.kill();
    });
  }


  // GPT4ALL
  async gpt(client, prompt, username){
    const gptProcess = spawn("python3", [
      "./python/gpt.py", `"${prompt}"`,
    ]);
    gptProcess.on('close', (code) => {
      if (code === 0) {
        const data = JSON.parse(fs.readFileSync(`./python/gpt_result.json`));
        const result = data.output;
        const startResponse = result.indexOf("\n");
        if (startResponse != -1 && (startResponse + 1) < result.length){
          const response = result.substring(startResponse + 1);
          const request = prompt + result.substring(0, startResponse);
          const output = bold(`${username}: \n`) + request + "\n" + bold("Bob: \n") + response + "\n\n";
          const channel = client.channels.cache.get(botDefaultTextChannelID);
          channel.send(output);    
          this.speak(response);
        } else {
          const response = result;
          const request = prompt;
          const output = bold(`${username}: \n`) + request + "\n" + bold("Bob: \n") + response + "\n\n";
          const channel = client.channels.cache.get(botDefaultTextChannelID);
          channel.send(output);    
          this.speak(response);
        }
      } else {
        console.error(`GPT exec error. Exit code: ${code}`);
      }
      this.isListeningToCommand = false;
      gptProcess.kill();
    });
  }

  // detect commands
  getCommand(input, commandList) {
    let commandName = null;
    return {
      command: commandList.find(command => {
        let result = false;
        command.names.forEach(name => {
          if (input.startsWith(name)) {
            commandName = name;
            result = true;
          }
        });
        return result;
      }),
      commandName: commandName
    }
  }
}

module.exports = Bob;

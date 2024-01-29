# DiscordBob
A discord bot (Bob Assistant) with ASR, GPT, play music from Youtube, and more...  

## Dependencies
- A Bot on Discord Developer Portal
- ffmpeg python3 python3-venv python3-pip libtool espeak
- nodejs
- pip: openai-whisper TTS
- npm: install (use package.json)
- .env: BOT_TOKEN, APP_ID, GUILD_ID, YOUTUBE_TOKEN, TEXT_CHANNEL_ID, VOICE_CHANNEL_ID

## How to run
First, you might want to create .env file with the keys above:
- BOT_TOKEN: The Token of the Discord Bot (check out the Discord Developer Portal)
- APP_ID: OAuth2 Client ID of the Bot (check out the Discord Developer Portal)
- GUILD_ID: Server ID (you should turn on Developer mode on Discord in order to see this)
- YOUTUBE_TOKEN: Token of Youtube Data API
- TEXT_CHANNEL_ID: Default Discord text channel for Bot to send text response in
- VOICE_CHANNEL_ID: Default Discord voice channel to join in automatically whenever bot is online

(Recommended) Using Docker, build image, then run container:
```
docker build -t discordbob:v1.0 .
docker run -d -it --restart always --env-file .env --name DiscordBobGPU --gpus all discordbob:v1.0
```

Or if you have installed everything manually, run:
```
node .
```
## How to use
The bot has 2 states:
- Listening to wake-word state (state 1)
- Listening to command state (state 2)

In state 1, only voice line with `Hey, Bob` will be accepted and then switch to stage 2.  
In stage 2, there are some voice commands below:
- ['play music', 'play the music', 'play song', 'play the song', 'play track', 'play the track', 'phát nhạc'] : to play music from Youtube search
- ['switch language', 'đổi ngôn ngữ'] : to switch the ASR language (in case you want to play songs in another language. I added English and Vietnamese only. You can add more if you want)
- ['reset bot'] : reinitialize the bot, reset its configurations and state to default.

You can also deploy your slash commands to your Discord server by using:
```
node deploy-commands.js
```
And then use the slash commands in your Discord server.
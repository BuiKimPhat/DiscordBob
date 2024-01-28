# DiscordBob
A discord bot (Bob Assistant) with ASR, GPT, play music from Youtube, and more...  

## Dependencies
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
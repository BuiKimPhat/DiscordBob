# DiscordBob
A discord bot (Bob Assistant) with ASR, GPT, play music from Youtube, and more...  

## Dependencies
- ffmpeg python3 python3-venv python3-pip libtool espeak
- nodejs
- pip: openai-whisper pyttsx3
- npm: install (use package.json)
- .env: BOT_TOKEN, APP_ID, GUILD_ID, YOUTUBE_TOKEN

## How to run
(Recommended) Using Docker, build image, then run container:
```
docker build -t dockerbob:latest .
docker run -d -it --restart always --name DockerBobGPU --gpus all dockerbob:latest
```

Or if you have installed everything manually, run:
```
node .
```
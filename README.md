# DiscordBob
A discord bot (Bob Assistant) with ASR, GPT, play music from Youtube, and more...  

## Dependencies
- ffmpeg
- nodejs
- python3
- pip: whisper, pyttsx3
- npm: install (use package.json)
- .env: BOT_TOKEN, APP_ID, GUILD_ID, YOUTUBE_TOKEN

## How to run
(Recommended) Using Docker, build image, then run container:
`
docker image build -t dockerbob:latest .
docker run -d -it --restart always --name DockerBobGPU --gpus all dockerbob:latest
`

Or if you install everything manually, after install all dependencies, run:
```
node .
```
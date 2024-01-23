FROM nvidia/cuda:12.3.1-base-ubuntu20.04
ARG DEBIAN_FRONTEND=noninteractive

WORKDIR /root
RUN apt update && apt install -y curl git &&\
    git clone https://github.com/BuiKimPhat/DiscordBob.git
WORKDIR /root/DiscordBob

RUN apt update && apt install -y ffmpeg python3 python3-venv python3-pip libtool espeak
RUN python3 -m venv .venv && chmod -R 777 .venv &&\
    .venv/bin/activate &&\
    .venv/bin/pip install openai-whisper TTS
RUN .venv/bin/whisper --model tiny --output_dir ./voice/transcript -f json audio/huh.mp3
RUN .venv/bin/whisper --model small --output_dir ./voice/transcript -f json audio/huh.mp3
RUN .venv/bin/tts --model_name tts_models/en/vctk/vits --use_cuda true --speaker_idx p230 --text "hi" --out_path /root/DiscordBob/voice/bob.mp3
RUN curl -fsSL https://deb.nodesource.com/setup_21.x | bash - && apt-get install -y nodejs
RUN npm install

ENTRYPOINT ["node"]
CMD ["."]
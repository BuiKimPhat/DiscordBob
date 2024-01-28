FROM nvidia/cuda:12.3.1-devel-ubuntu22.04
ARG DEBIAN_FRONTEND=noninteractive

WORKDIR /root
RUN apt update && apt install -y curl wget git python3
RUN mkdir DiscordBob && apt update && apt install -y ffmpeg libtool espeak
RUN apt install -y python3-pip && pip install openai-whisper TTS gpt4all
RUN curl -fsSL https://deb.nodesource.com/setup_21.x | bash - && apt-get install -y nodejs
COPY . /root/DiscordBob
WORKDIR /root/DiscordBob

RUN whisper --model tiny --output_dir ./voice/transcript -f json audio/huh.mp3 &&\
    whisper --model small --output_dir ./voice/transcript -f json audio/huh.mp3 &&\
    tts --model_name tts_models/en/vctk/vits --speaker_idx p230 --text "hi" --out_path /root/DiscordBob/voice/bob.mp3 &&\
    python3 ./python/gpt.py
RUN npm install

ENTRYPOINT ["node"]
CMD ["."]
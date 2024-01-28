FROM nvidia/cuda:12.3.1-devel-ubuntu22.04
ARG DEBIAN_FRONTEND=noninteractive

WORKDIR /root
RUN apt update && apt install -y curl wget git
RUN mkdir DiscordBob && apt update && apt install -y ffmpeg libtool espeak
RUN python3 -m venv /opt/.venv && chmod -R 777 /opt/.venv
ENV PATH /opt/.venv/bin:$PATH
RUN activate &&\
    pip install openai-whisper TTS
RUN curl -fsSL https://deb.nodesource.com/setup_21.x | bash - && apt-get install -y nodejs
COPY . /root/DiscordBob
WORKDIR /root/DiscordBob

RUN whisper --model tiny --output_dir ./voice/transcript -f json audio/huh.mp3
RUN whisper --model small --output_dir ./voice/transcript -f json audio/huh.mp3
RUN tts --model_name tts_models/en/vctk/vits --speaker_idx p230 --text "hi" --out_path /root/DiscordBob/voice/bob.mp3
RUN npm install

ENTRYPOINT ["node"]
CMD ["."]
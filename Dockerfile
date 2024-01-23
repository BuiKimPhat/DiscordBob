FROM nvidia/cuda:12.3.1-base-ubuntu20.04
ARG DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y curl git &&\
    git clone https://github.com/BuiKimPhat/DiscordBob.git
WORKDIR DiscordBob

RUN apt install -y ffmpeg python3 python3-venv python3-pip libtool espeak
RUN python3 -m venv .venv && chmod -R 777 .venv &&\
    .venv/bin/activate &&\
    .venv/bin/pip install openai-whisper pyttsx3
RUN curl -fsSL https://deb.nodesource.com/setup_21.x | bash - && apt-get install -y nodejs
RUN npm install

ENTRYPOINT ["node"]
CMD ["."]
FROM nvidia/cuda:12.3.1-base-ubuntu20.04
ARG DEBIAN_FRONTEND=noninteractive

RUN apt update && apt install -y git curl
RUN git clone https://github.com/BuiKimPhat/DiscordBob.git
WORKDIR DiscordBob

RUN apt install -y curl ffmpeg
RUN apt install -y python3 python3-venv
RUN python3 -m venv .venv
RUN chmod -R 777 .venv
RUN .venv/bin/activate
RUN apt install -y python3-pip libtool espeak
RUN .venv/bin/pip install openai-whisper pyttsx3
RUN curl -fsSL https://deb.nodesource.com/setup_21.x | bash - && apt-get install -y nodejs
RUN npm install

ENTRYPOINT ["node"]
CMD ["."]
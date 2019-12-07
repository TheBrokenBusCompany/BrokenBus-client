FROM tiangolo/uwsgi-nginx-flask:python3.7

RUN git clone https://github.com/TheBrokenBusCompany/BrokenBus-client.git /tmpGit

RUN cp -r /tmpGit/* /app

WORKDIR /app

RUN pip install -r requirements.txt

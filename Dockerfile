# FROM nginx:latest
# COPY . /usr/share/nginx/html/
FROM python

EXPOSE 6789

WORKDIR /usr/src/app

COPY requirements.txt ./
RUN pip install --no-cache-dir websockets

COPY . .

CMD [ "python", "./tetris.py" ]
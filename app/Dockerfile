#stage 1
FROM node:14-alpine as node
WORKDIR /app
COPY front-end/ .
RUN npm install
RUN npm run build

#stage 2  
FROM python:3.7
WORKDIR /app/src
COPY --from=node /app/dist/front-end /app/src/static
COPY src/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY src/ .
EXPOSE 5000

CMD [ "python", "app.py" ]

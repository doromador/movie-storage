# локальний запуск
# npm i
# docker build -t movies-storage .
# docker run --name movies -p 8000:3000 -e APP_PORT=3000 movies-storage

# запуск з DockerHub
# docker run --name movies -p 8000:3000 -e APP_PORT=3000 doromador/movie-storage

# API за структурою подібне до аналога - https://documenter.getpostman.com/view/356840/TzkyLeVK#def3d8ad-9729-4b51-8f4e-ed03fa5340ce
# в ендпоіті - http://localhost:8000/api/movies/import
# В postman не забути використати вкладку form-data
# VALUE - файл, CONTENT TYPE - File
# файл збережено в структурі проекту - sample_movies.txt
#



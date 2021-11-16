docker build -t registry.gitlab.com/more-happi/more-happi-backend:manual .
docker push  registry.gitlab.com/more-happi/more-happi-backend:manual
docker tag registry.gitlab.com/more-happi/more-happi-backend:manual registry.gitlab.com/more-happi/more-happi-backend:latest
docker push registry.gitlab.com/more-happi/more-happi-backend:latest
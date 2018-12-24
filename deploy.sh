docker build -t logeshkumar/multi-client:latest -t logeshkumar/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t logeshkumar/multi-server:latest -t logeshkumar/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t logeshkumar/multi-worker:latest -t logeshkumar/multi-worker:$SHA -f ./worker/Dockerfile ./worker
docker push logeshkumar/multi-client:latest
docker push logeshkumar/multi-server:latest
docker push logeshkumar/multi-worker:latest

docker push logeshkumar/multi-client:$SHA
docker push logeshkumar/multi-server:$SHA
docker push logeshkumar/multi-worker:$SHA

kubectl apply -f k8s
kubectl set image deployments/client-deployment client=logeshkumar/multi-client:$SHA
kubectl set image deployments/server-deployment server=logeshkumar/multi-server:$SHA
kubectl set image deployments/worker-deployment worker=logeshkumar/multi-worker:$SHA
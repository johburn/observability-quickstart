all: deploy

deploy:
	helm upgrade --reuse-values prometheus prometheus-community/kube-prometheus-stack -n observability -f k8s/config/prometheus/values.yml
	kubectl apply -f k8s/config/prometheus/rules.yml
	kubectl apply -f k8s/config/alertmanager/alertmanager-config.yml

test-single-notification:
	kubectl scale deployment/mysql --replicas=0 -n applications
	@echo "Waiting 5 minutes"
	sleep 300
	kubectl scale deployment/mysql --replicas=1 -n applications
	
test-group-notification:
	kubectl scale deployment format-service-depl --replicas=1 -n applications
	kubectl scale deployment hello-service-depl --replicas=1 -n applications
	kubectl scale deployment people-service-depl --replicas=1 -n applications
	@echo "Waiting 5 minutes"
	sleep 300
	kubectl scale deployment format-service-depl --replicas=2 -n applications
	kubectl scale deployment hello-service-depl --replicas=2 -n applications
	kubectl scale deployment people-service-depl --replicas=2 -n applications

clean:
	kubectl delete -f k8s/config/prometheus/rules.yml
	kubectl delete -f k8s/config/alertmanager/alertmanager-config.yml
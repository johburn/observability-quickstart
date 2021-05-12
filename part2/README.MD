## Part 2 - Alerts

This repository is meant to demonstrate the alerting with Prometheus deployed with Operator and the Slack receiver.

This folder contains the following resources:

1. AlertManager configuration with a Slack receiver.
2. Alert Rules.
3. Helm value file to update the deployment with a Prometheus Template.

### Deploy Configuration

```sh
make
```

### Test Alerts

Test single alert notification

```sh
make test-single-notification
```

Test grouped alert notification

```sh
make test-group-notification
```


### Clean Resources

```sh
make clean
```
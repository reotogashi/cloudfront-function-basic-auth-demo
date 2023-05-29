# cloudfront-function-basic-auth-demo

## 0. Prerequisite

```
$ aws --version
aws-cli/2.4.27 Python/3.8.8
```

```
$ cdk --version
2.64.0
```

```
$ node -v
v16.18.1
```

```
$ npm -v
8.19.2
```

- Install Session Manager plugin for the AWS CLI
  - https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html

## 1. How to run cdk locally

- Copy `.env.local` and create `.env`
- Add variable in `.env`
- Set your profile in your local env
- Run `npm install`
- Update `authUser` and `authPass` in `lib/assets/cloudfront/basicAuth.js`.

### Bootstrap (First time only)
Please run this command first to bootstrap. Only one time is enough.

```
cdk bootstrap --profile {your profile}
```

### Diff
Please use this command if you want to check the differences of resources after you update your CDK.

```
cdk diff --profile {your profile}
```

### Deploy
Please use this command if you want to deploy.

```
cdk deploy --profile {your profile}
```

### Destroy
Please use this command if you want to destroy all resourced created by CDK.

```
cdk destroy --profile {your profile}
```

## 2. Verification

- Access to `https://${the distribution domain name}`. Basic authentication popup should be displayed.
  - `${the distribution domain name}` should be in the form of `xxx.cloudfront.net`
- Input a correct username and password. Website content in `./lib/assets/s3/index.html` should be displayed.
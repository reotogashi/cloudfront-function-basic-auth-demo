import * as cdk from 'aws-cdk-lib'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as s3Deployment from 'aws-cdk-lib/aws-s3-deployment'
import * as cf from 'aws-cdk-lib/aws-cloudfront'

import { type Construct } from 'constructs'

export class ApplicationStack extends cdk.Stack {
  private s3Bucket: s3.Bucket

  constructor (scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    this.s3()
    this.cloudFront()
  }

  private s3 () {
    // Create s3 bucket
    this.s3Bucket = new s3.Bucket(this, 'S3Bucket', {
      bucketName: 'cloudfront-function-basic-auth-demo', // Please update if the bucket name is duplicated
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Remove S3 bucket when destroying resources by cdk destroy
      autoDeleteObjects: true // Delete objects in S3 bucket when deleting S3 bucket since it is necessary to empty the bucket for deletion.
    })

    // Deploy index html
    new s3Deployment.BucketDeployment(this, 'S3BucketDeployment', {
      sources: [s3Deployment.Source.asset('./lib/assets/s3')],
      destinationBucket: this.s3Bucket
    })
  }

  private cloudFront () {
    // Origin Access Identity
    const cfOAI = new cf.OriginAccessIdentity(
      this,
      'OriginAccessIdentity'
    )
    // Add OAI to S3 bucket
    this.s3Bucket.grantRead(cfOAI)

    // CloudFront Functions
    const cfFunction = new cf.Function(
      this,
      'CloudFrontFunction',
      {
        functionName: 'cloudfront-basic-auth',
        code: cf.FunctionCode.fromFile({
          filePath: './lib/assets/cloudfront/basicAuth.js'
        })
      }
    )

    // CloudFront Distrubution
    new cf.CloudFrontWebDistribution(
      this,
      'CloudfrontDistribution',
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: this.s3Bucket,
              originAccessIdentity: cfOAI
            },
            behaviors: [
              {
                isDefaultBehavior: true,
                // Set CloudFront Function to Distribution
                functionAssociations: [
                  {
                    eventType: cf.FunctionEventType.VIEWER_REQUEST,
                    function: cfFunction
                  }
                ]
              }
            ]
          }
        ],
        defaultRootObject: 'index.html'
      }
    )
  }
}

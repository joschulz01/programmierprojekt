terraform {
  required_version = "=1.8.1"
  required_providers {
    aws = {
      source  = "aws"
      version = "5.30.0"
    }
  }
}

locals {
  environment = terraform.workspace
}

module "vars" {
  source      = "vars"
  environment = local.environment
}

module "ec2"{
  source = "aws_ec2"
}

#Example how to reference variables
resource "example_resource" "example" {
  name      = module.vars.env.var1
  more_vars = module.vars.env.add_more_vars
}
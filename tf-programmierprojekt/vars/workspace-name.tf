locals {
  workspace-name = {
    aws_region              = "eu-central-1"
    aws_profile             = "pp2024"
    aws_allowed_account_ids = toset(["390403901012"])
    aws_default_tags = {
      Infrastructure-as-Code-Tool = "Terraform"
    }
  }
  # tflint-ignore: terraform_unused_declarations
  add_more_vars = "more_vars"
}
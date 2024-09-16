locals {
  workspace-name = {
    aws_region              = "eu-central-1"          // e.g. eu-central-1
    aws_profile             = "pp2024"          // e.g. hwl-dxp-prod
    aws_allowed_account_ids = toset(["390403901012"]) // e.g.
    aws_default_tags = {
      Infrastructure-as-Code-Tool = "Terraform"  // Terraform
    }
  }
  # tflint-ignore: terraform_unused_declarations
  add_more_vars = "more_vars"
}
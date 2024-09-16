provider "aws" {
  region              = module.vars.env.aws_region
  profile             = module.vars.env.aws_profile
  allowed_account_ids = module.vars.env.aws_allowed_account_ids

  default_tags {
    tags = module.vars.env.aws_default_tags
  }
}

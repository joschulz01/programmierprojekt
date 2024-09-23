resource "aws_instance" "web" {
  ami           = "ami-04f76ebf53292ef4d"
  instance_type = "t2.micro"

  tags = {
    Name = "HelloWorld"
  }
}
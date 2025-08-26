resource "aws_lambda_function" "s3_presigned_url" {
  filename         = "s3-presigned-url-lambda.zip"
  function_name    = "s3-presigned-url-generator"
  role            = aws_iam_role.lambda_role.arn
  handler         = "s3-presigned-url-lambda.handler"
  runtime         = "nodejs18.x"
  timeout         = 30

  environment {
    variables = {
      AWS_REGION = var.aws_region
    }
  }
}

resource "aws_iam_role" "lambda_role" {
  name = "s3-presigned-url-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy" "lambda_s3_policy" {
  name = "s3-presigned-url-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject"
        ]
        Resource = "arn:aws:s3:::*/*"
      }
    ]
  })
}

resource "aws_api_gateway_rest_api" "s3_api" {
  name = "s3-presigned-url-api"
}

resource "aws_api_gateway_resource" "presigned_url" {
  rest_api_id = aws_api_gateway_rest_api.s3_api.id
  parent_id   = aws_api_gateway_rest_api.s3_api.root_resource_id
  path_part   = "presigned-url"
}

resource "aws_api_gateway_method" "post_presigned_url" {
  rest_api_id   = aws_api_gateway_rest_api.s3_api.id
  resource_id   = aws_api_gateway_resource.presigned_url.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda_integration" {
  rest_api_id = aws_api_gateway_rest_api.s3_api.id
  resource_id = aws_api_gateway_resource.presigned_url.id
  http_method = aws_api_gateway_method.post_presigned_url.http_method

  integration_http_method = "POST"
  type                   = "AWS_PROXY"
  uri                    = aws_lambda_function.s3_presigned_url.invoke_arn
}

resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.s3_presigned_url.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.s3_api.execution_arn}/*/*"
}

output "api_gateway_url" {
  value = "${aws_api_gateway_rest_api.s3_api.execution_arn}/presigned-url"
}
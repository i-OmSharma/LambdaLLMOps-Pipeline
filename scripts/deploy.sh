#!/bin/bash

# Deploy Lambda LLM Ops Pipeline
set -e

echo "🚀 Starting deployment..."

# Get the S3 bucket name from SAM template
BUCKET_NAME=$(aws cloudformation describe-stacks --stack-name llmops-stack --query 'Stacks[0].Outputs[?OutputKey==`S3ContextBucket`].OutputValue' --output text 2>/dev/null || echo "llmops-context-$(aws sts get-caller-identity --query Account --output text)")

echo "📦 Uploading context files to S3 bucket: $BUCKET_NAME"

# Upload context files to S3
aws s3 cp context/demo_context.json s3://$BUCKET_NAME/demo_context.json

# Create additional context files for different categories
cat > context/documents_general.json << 'EOF'
{
  "agent": "General Document Assistant",
  "instructions": "You are an AI assistant that helps with general document-related questions. Provide clear, helpful responses about document management, formatting, and organization.",
  "examples": [
    {
      "user": "How should I format a business proposal?",
      "assistant": "A business proposal should include: executive summary, problem statement, proposed solution, timeline, budget, and conclusion. Use clear headings and professional formatting."
    }
  ],
  "tone": "Professional and helpful"
}
EOF

cat > context/documents_technical.json << 'EOF'
{
  "agent": "Technical Documentation Assistant",
  "instructions": "You are an AI assistant specialized in technical documentation. Help with API documentation, code comments, technical specifications, and developer guides.",
  "examples": [
    {
      "user": "How do I document an API endpoint?",
      "assistant": "Include: endpoint URL, HTTP method, request parameters, response format, status codes, authentication requirements, and usage examples."
    }
  ],
  "tone": "Technical and precise"
}
EOF

# Upload all context files
aws s3 cp context/documents_general.json s3://$BUCKET_NAME/documents/general.json
aws s3 cp context/documents_technical.json s3://$BUCKET_NAME/documents/technical.json

echo "✅ Context files uploaded successfully"

# Deploy SAM template
echo "🏗️  Deploying SAM template..."
cd infra
sam build
sam deploy --guided
cd ..

echo "🎉 Deployment completed successfully!"
echo "📋 API Gateway URL: $(aws cloudformation describe-stacks --stack-name llmops-stack --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' --output text)"

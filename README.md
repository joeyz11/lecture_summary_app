Lecture Summary is a web app for uploading lecture audio for transcription, summarization, and flashcard generation.

Below is a list of technologies and resources I used for this project.

<br>

### Design

Figma

• Ideation

• Design Diagram

[System Architecture Design Diagram](https://www.figma.com/design/CvS7emZYbDgixJv5K8j6ce/Lecture-Summary-App?node-id=0-1&t=s53nZJY3626FQozJ-0)

<br>

### Frameworks

Next.js 

• Fullstack framework, with support for both client-side and server-side rendering as well as routing

• Seemless integrations with libraries such as Tailwind CSS and NextAuth.js

https://nextjs.org/

https://tailwindcss.com/

<br>

### Authentication

NextAuth.js

• Authenicates user with Google Provider

• Protects pages with user data

https://next-auth.js.org/

https://youtu.be/AbUVY16P4Ys?si=j-eJrjA04UW9iRhL

<br>

### Database and Storage

AWS DynamoDB

• Storage of user data and s3 links

AWS S3

• Multipart concurrent uploading

• Storage of media such as audio files and captions

https://docs.aws.amazon.com/AmazonS3/latest/userguide/mpu-upload-object.html

<br>

### Containerization

Docker

• Container isolation and dependency management

AWS ECR

• Repository for Docker images on AWS

https://github.com/vercel/next.js/tree/canary/examples/with-docker

https://us-east-2.console.aws.amazon.com/ecr/repositories/private/471112555652/lecture-summary?region=us-east-2

<br>

### APIs

OpenAI

• Prompt engineering

• Text summarization and flashcard object generation

AWS

• Utilized SDKs, has good ecosystem

AWS Transcribe

• Speech to Text transcription

https://youtu.be/CjKhQoYeR4Q?si=6dO5BL_P3prjkqxl

https://youtu.be/mDRoyPFJvlU?si=77LYw7Kj8YruLZ0f

https://www.reddit.com/r/ChatGPTPro/comments/13n55w7/highly_efficient_prompt_for_summarizing_gpt4/

<br>

### Serverless

AWS Lambda

• Event-driven function calls

<br>

### Hosting

AWS ECS Fargate

• Deployment, application load balancing, fault tolerance


AWS Cloudfront

• CDN for streaming audio

• Only in North America and Europe and no Firewall enabled

https://youtu.be/DVrGXjjkpig?si=q4dhbRS0YElHMKLj

https://futuristicgeeks.com/a-step-by-step-guide-deploying-next-js-website-to-aws-ec2-instance/

https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-container-image.html

https://youtu.be/rUgZNXKbsrY?si=KxF5O-rvkAITKWqD

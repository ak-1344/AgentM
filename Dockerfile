# Use the official n8n image
FROM n8nio/n8n:latest

# Switch to root user to avoid permission issues on Render
USER root

# Expose the port n8n runs on
EXPOSE 5678

# Command to start n8n
CMD ["n8n", "start"]
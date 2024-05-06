# Prestart Config

## Introduction
Prestart Config is a command-line utility used to load and configure settings from various sources such as MongoDB, Google Sheets, and more.

## Environment Configuration
Before using prestart-config, you need to configure some environment variables as follows:
In the directory there must be an [.env] file and the following variables must be configured 

- `MONGO_URL`: Connection URL to MongoDB (if using MongoDB).
- `GOOGLE_SERVICE_ACCOUNT_EMAIL`: Email of Google service account (if using Google Sheets).
- `GOOGLE_PRIVATE_KEY`: Private key of Google service account (if using Google Sheets).

Note: For the `GOOGLE_PRIVATE_KEY` environment variable, you need to provide the private key as a string, but keep in mind that this string is often long and distributed. Make sure you copy this string accurately.

## Example Usage: 
  - `npx -y prestart-config -f <from> -s <source> -d <dir>`
  1. Load configuration from MongoDB:
    If use config mongo .env
    ```sh
    npx -y prestart-config -f mongo -s <collection name> -d <out directory>
    ```
    If use Mongo URL Connection 
    - Example:  
    ```sh
    npx -y prestart-config -f <mongodb+srv:// ...> -s <collection name> -d <out directory>
    ```
  2. Load configuration from GoogleSheet:
    - Example:  
    ```sh
    npx -y prestart-config -f <Google Sheets URL> -s <sheet name> -d <output directory>
    ```

## Reference Documentation
Detailed reference documentation for prestart-config can be found at [link repository](https://github.com/royalggit parter/prestart-config).

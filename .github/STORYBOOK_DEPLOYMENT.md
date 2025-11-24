# Storybook Deployment to GitHub Pages

This repository is configured to automatically deploy Storybook to GitHub Pages.

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/grahamcrackers/ui`
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**

### 2. Trigger Deployment

The workflow will automatically run when you:

- Push to the `develop` or `main` branch
- Manually trigger it from the **Actions** tab

### 3. Access Your Storybook

Once deployed, your Storybook will be available at:

```
https://grahamcrackers.github.io/ui/
```

## Workflow Details

The deployment workflow (`deploy-storybook.yml`) does the following:

1. **Build Job**
    - Checks out the code
    - Sets up pnpm (v10.18.0) and Node.js (v18)
    - Installs dependencies
    - Builds the Storybook
    - Uploads the built files as an artifact

2. **Deploy Job**
    - Takes the built artifact
    - Deploys it to GitHub Pages

## Manual Deployment

You can also manually trigger the deployment:

1. Go to the **Actions** tab in your repository
2. Select the "Deploy Storybook to GitHub Pages" workflow
3. Click **Run workflow**
4. Select the branch and click **Run workflow**

## Troubleshooting

### Build Failures

If the build fails, check:

- All dependencies are properly listed in `package.json` files
- The build script works locally: `pnpm --filter=storybook build`
- Check the Actions logs for specific error messages

### Deployment Not Working

If the deployment succeeds but the site isn't accessible:

- Verify GitHub Pages is enabled in repository settings
- Check that the source is set to "GitHub Actions"
- Wait a few minutes for DNS propagation

### Permission Errors

If you see permission errors:

- Ensure the workflow has the correct permissions in the workflow file
- Check your repository's Actions permissions in Settings → Actions → General

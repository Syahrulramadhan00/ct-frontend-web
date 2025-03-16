# Resolving GitHub Permission Issues

If you encounter the following error:
```
remote: Permission to MahendraKhibrah/ct-fronend-web.git denied to Syahrulramadhan00.
fatal: unable to access 'https://github.com/MahendraKhibrah/ct-fronend-web.git/': The requested URL returned error: 403
```

Follow these steps to resolve it:

## 1. Check Repository Access
Ensure that the user `Syahrulramadhan00` has been granted the necessary permissions to access the repository. This can be done by the repository owner or an administrator.

## 2. Verify Authentication
Make sure that the correct credentials are being used. If you are using HTTPS, you may need to update your credentials:
```sh
git config --global credential.helper cache
```

## 3. Use SSH Instead of HTTPS
If you have SSH access set up, you can switch to using SSH instead of HTTPS. First, add your SSH key to your GitHub account, then change the remote URL:
```sh
git remote set-url origin git@github.com:MahendraKhibrah/ct-fronend-web.git
```

## 4. Request Access
If you do not have access, request the repository owner to grant you the necessary permissions.

## 5. Check Origin URL
To check the origin URL of your Git repository, use the following command:
```sh
git remote -v
```
This command will display the URLs of all remotes associated with your repository.

CNewsBites Front End
====

CNewsBites Website

# Dependencies
[Compass](http://compass-style.org/)

[Ant](http://ant.apache.org/)

[S3cmd](http://s3tools.org/download) (optional)

# Documentation
TODO: Add documentation

# Building
Clone the repository
```
git clone git@github.com:jmahony/CNewsBites-FE.git
```

Build with Ant
```
cd CNewsBites-FE && ant
```

# S3 Deploy
Deploying requires S3cmd to be installed and configured. Simply create a file ~/.s3cfg with the below:
```xml
[default]
access_key = XXXXXXXXXXXXXXXXXX
secret_key = XXXXXXXXXXXXXXXXXX
```

Then to deploy the build to S3. 
```
ant deploy
```
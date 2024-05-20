## Smart Parking Lot

The application is built to ease the vehicle parking problem in designated lots. Each parking lot will have a QR code to scan at the entrance and then the driver will be directed towards an available spot.
![image](https://github.com/AmaanKang/SmartParking/assets/77933148/ea1a6cf8-236d-4266-a1f0-66c429b2a1f0)

The driver can decide to view the available parking on their own through app or they can choose to park at a spot recommended by the app.

# Features

- Any client entering into the parking spot will have access to QR code to scan and view the parking lot. This will show all occupied spots in red and free spots in white. The nearest parking spot is shown in green on the page.
- The app also includes an admin side. On the Home page, the admins can login with a username and password.
- This provides admins an extra button on the home page to view the parking spot analytics. The analytics include graphical view of the average occupied spots per hour in last week.
- The admins can also see four different buttons on the Map Page. These buttons assist them in adding new parking spot, deleting a current parking spot, updating the status of the free/occupied spot and changing the entrance of the parking lot since the suggested parking spot is based on entrance distance.

# Upcoming Features

- There will be a predictions section on the analytics page that tells the admins as how much busy the parking spot will be in next week. This will be based on a machine learning model that does predictions. So need to build and train the model, then incorporate this into the application.
- Right now, the parking spots are shown with rectangles on the screen, would like to make the visuals better by using a 2d or 3d library on it.

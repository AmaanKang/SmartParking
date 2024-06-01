## Smart Parking Lot

The application is built to ease the vehicle parking problem in designated lots. Each parking lot will have a QR code to scan at the entrance and then the driver will be directed towards an available spot.
![image](https://github.com/AmaanKang/SmartParking/assets/77933148/ea1a6cf8-236d-4266-a1f0-66c429b2a1f0)

The driver can decide to view the available parking on their own through app or they can choose to park at a spot recommended by the app.

# Features

- Any client entering into the parking spot will have access to QR code to scan and view the parking lot. This will show all occupied spots in red and free spots in white. The nearest parking spot is shown in green on the page. There is a socket setup that updates the occupied spots every minute.
![image](https://github.com/AmaanKang/SmartParking/assets/77933148/8732e166-631f-4c61-99fd-53cd5b28ffa2)

- The app also includes an admin side. On the Home page, the admins can login with a username and password. The authentication is handled by Firebase.
![image](https://github.com/AmaanKang/SmartParking/assets/77933148/b99cada4-221a-4f10-ad35-1a5763f6a558)

- This provides admins an extra button on the home page to view the parking spot analytics. The analytics include graphical view of the average occupied spots per hour in last week. There is also another graph that predicts as how busy the parking lot will be in next week. This is based on a python script running in background every Sunday at 6 am. The python script is running an ML model that gathers data every week and trains iteself. This model makes the prediction about next week.
![image](https://github.com/AmaanKang/SmartParking/assets/77933148/976c0a89-31e4-4bf9-90fb-af7380ebf7cf)


- The admins can also see four different buttons on the Map Page. These buttons assist them in adding new parking spot, deleting a current parking spot, updating the status of the free/occupied spot and changing the entrance of the parking lot since the suggested parking spot is based on entrance distance.
![image](https://github.com/AmaanKang/SmartParking/assets/77933148/a80be47d-7513-428b-8b53-371536bacd0b)


# Upcoming Features

- Right now, the parking spots are shown with rectangles on the screen, would like to make the visuals better by using a 2d or 3d library on it.
- In order to make the development easier, the sensors data is generated randomly by using Faker dependency. Will like to have the actual sensors built in that are implanted at each spot. These sensors can then talk to the Parking Spots every minute.

# Master-rad
# Septeber, 2022

The web application represents the master thesis called ‘Workspace Management Application’. The application aims to automate sharing of space and resources in business organizations, especially in those where a hybrid work model is used.

Employees can choose the days when they want to work from the company, simply by selecting the desired days in the calendar. They can also see their colleagues' calendars and adjust their schedules to colleagues.

An employee distribution algorithm is implemented within the application. It groups people from the same team to be together in the office. It executes at 20h and generates the seating schedule for the next working day by information on who chose to be present. The seating schedule by offices is visible to both employees and administrators.

Administrators have options to create and manage offices, assign projects to workers, and see company occupancy statistics. The statistic is represented by using the histogram. It has two columns. One shows how many people selected to work from the office for the observed day. The other column shows the number of people who wanted to come, but there were not enough workplaces. Due to the statistics, administrators can adjust the capacity of the company.

The application is written using MERN technologies (MongoDB, Express, React, Node). The employee distribution algorithm is implemented as a Python script.

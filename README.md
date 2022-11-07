# Master-rad
# Septeber, 2022

The web application represents the master thesis called ‘Workspace Management Application’. The application aims to automate sharing of space and resources in business organizations, especially in those where a hybrid work model is used.

Employees can choose the days when they want to work from the company, simply by selecting the desired days in the calendar. They can also see their colleagues' calendars and adjust their schedules to colleagues.

An employee distribution algorithm is implemented within the application. It groups people from the same team to be together in the office. It executes at 20h and generates the seating schedule for the next working day by information on who chose to be present. The seating schedule by offices is visible to both employees and administrators.

Administrators have options to create and manage offices, assign projects to workers, and see company occupancy statistics. The statistic is represented by using the histogram. It has two columns. One shows how many people selected to work from the office for the observed day. The other column shows the number of people who wanted to come, but there were not enough workplaces. Due to the statistics, administrators can adjust the capacity of the company.

The application is written using MERN technologies (MongoDB, Express, React, Node). The employee distribution algorithm is implemented as a Python script.

The algorithm consists of 3 steps:
1. Sorting input data
2. Recursively try to put all workers from one or more projects in each office, so the office is full. This step is optimized by not considering options to put workers in those offices where there is no chance for all the workers to fulfill the office optimally.
3. Recursively find all combinations of putting not distributed workers in remained offices, and choose the best combination using a predefined cost function.

The cost function is 1 if all workers from the same project are in one office. Otherwise, the cost function is multiplied by a predefined factor for each project, which is also 1 at the beginning. For all offices where the workers from the considered project are, the factor will be multiplied by the number of workers on the project in the office and divided by the number of all workers on the project. In that way, the distribution where workers from one project are in less number of offices is favored. The less the cost function is, the distribution is better.

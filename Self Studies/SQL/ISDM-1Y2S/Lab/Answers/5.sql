--Lab Sheet 5select *from student--a) Display the number of students for each course? List the Course_ID of courses only if there are less than 10 students for the course.
select CID
from Student
group by CID
having count(SID)<10

--b) List the Course_ID and the number of modules offered for each course. Display only the course ids which have more than 3 modules offered in it. Sort the result according to the ascending order of the module count
select CID,count(Mcode) 
from Offers
group by CID
having count(Mcode)>3
order by count(Mcode)

--c) Display the course id, academic year and the number of modules offered. The The number of modules offered should be less than 10.
select CID,Accadamic_year,count(Mcode)
from Offers
group by CID,Accadamic_year
having count(Mcode)<10

--d) List the courses that offer more than 2 modules for year 3 students?
select CID
from Offers
where Accadamic_year='Y3'
group by CID
having Count(Mcode)>2

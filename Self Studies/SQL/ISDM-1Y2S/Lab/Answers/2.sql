--Labsheet 1 --
--Section 1--

--a. Find all information about the students.
select *
from Student

--b. Find the module name and the no of credits for a module.
select NoOfCredits
from Module

--c. Find students whose name start with letter 'A'.
select Sname
from Student
where Sname like 'A%'

--d. Find the names of the students who were born before 1996/01/01.

select Sname
from Student
where dob>'1996/01/01'

--e. Find name and NIC of students who are from ‘Colombo’ District.
select Sname,NIC
from Student
where Address like '%Colombo%'

--f. Find the students whose names are starting from ‘K’ and following ‘DS’ course.
select Sname
from Student 
where Sname like 'K%' and CID like '%DS%'

--g. Select the students who are following either ‘DS’ or ‘IT’ courses.
select Sname
from Student
where CID like '%DS%' or CID like '%IT'

--Section 2--

--a. Select all the students sorted by the sname column.
select Sname
from Student
order by Sname

--b. Select all students from the "Student" table, sorted DESCENDING by the "NIC" column.
select Sname
from Student
order by nic

--c. Select all students from the "Student" table, sorted ASCENDING by the "sname" column and descending by the "CID" column
select Sname , CID
from Student
order by Sname, CID desc

--Section 1--
--Display the number of students from each course. 
select CID, count(Sname)
from Student
group by CID


--Section 2--
--a. Display the total number of modules in each course?
select  CID,count(Mcode)
from Offers
group by CID

select *
from student

--b. How many students are there for each course? Re name the count as ‘Number of Student’.
select  CID,count(SID)
from Student
group by CID

--c. What is the number of Modules offered by each course in each academic year?
select CID,Accadamic_year ,count(Mcode)
from Offers
group by CID, Accadamic_year

--d. What is the number of Modules in Semester 02 only?
select CID,count(Mcode),Accadamic_year
from Offers
where Semester=2
group by CID,Accadamic_year


--e. Sort the results of Question (d.) according to the ascending order of CID.
select CID,count(Mcode)
from Offers
where Semester=2
group by CID,Accadamic_year
order by CID

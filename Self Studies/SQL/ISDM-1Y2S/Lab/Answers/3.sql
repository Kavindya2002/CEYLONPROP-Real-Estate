-- Section 2--
--a. How many students are in the university?
select count(SID)
from Student

--b. How many courses are offered by the university?
select COUNT(Cname)
from Course

--c. Display the above result with the title “Number of courses”. 
select COUNT(Cname) as 'Number of courses'
from Course

--d. How many modules are there which have 03 credits only?
select COUNT(NoOfCredits)
from Module
where NoOfCredits= 3

--e. If one student wants to register all courses at ones, what is the total course fee that he/she wants to pay? 
select sum(C_fee)
from Course

--f. What is the highest course fee?
select max(C_fee)
from Course

--g. What is the lowest course fee?
select min(C_fee)
from Course

--h. What is the Average courses fee of a course?
select avg(C_fee)
from Course

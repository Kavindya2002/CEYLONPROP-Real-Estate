create table emp
(
	eid integer primary key,
	ename varchar(25),
	age int,
	salary float
)

insert into emp values(1000,'Lakmal',33,90000)
insert into emp values(1001,'Nadeeka',24,28000)
insert into emp values(1002,'Amila',26,35000)
insert into emp values(1003,'Nishani',28,60000)
insert into emp values(1004,'Krishan',36,95000)
insert into emp values(1005,'Surangi',37,22000)
insert into emp values(1006,'Shanika',24,18000)
insert into emp values(1007,'Amali',21,20000)
insert into emp values(1008,'Charith',28,35000)
insert into emp values(1009,'Prasad',40,95000)

create table dept
(
did char(12) primary key,
budget float,
managerId int foreign key references emp
)

insert into dept values('Academic',900000,1002)
insert into dept values('Admin',120000,1000)
insert into dept values('Finance',3000000,1008)
insert into dept values('ITSD',4500000,1000)
insert into dept values('Maintenance',40000,1004)
insert into dept values('SESD',20000,1004)
insert into dept values('Marketing',90000,1008)

create table works
(
eid int foreign key references emp,
did Char(12) foreign key references dept,
pct_time int,
primary key(eid,did)
)

insert into works values(1000,'Admin',40)
insert into works values(1000,'ITSD',50)
insert into works values(1001,'Admin',100)
insert into works values(1002,'Academic',100)
insert into works values(1003,'Admin',20)
insert into works values(1003,'Academic',30)
insert into works values(1003,'ITSD',45)
insert into works values(1004,'Admin',60)
insert into works values(1004,'Finance',30)
insert into works values(1006,'Finance',45)
insert into works values(1006,'Maintenance',52)
insert into works values(1008,'Maintenance',30)
insert into works values(1008,'ITSD',30)
insert into works values(1008,'Finance',35)
insert into works values(1009,'Admin',100)


select *
from dept
select *
from works
select *
from emp
  --Create a view named dept_info that contains name of the department, budget and manager’s name

create view dept_Info(depId,Budgets,Name) as
select d.did,d.budget,e.ename
from dept d,emp e
where d.managerId=e.eid

select *
from dept_Info
drop view dept_Info

--Create a view named emp_info which contains eid, name, salary and total percentage of time.

create view emp_Info(EID,ENAME,ESALARY,ETIME)as
select e.eid,e.ename,e.salary,sum(w.pct_time)
from emp e , works w
where e.eid=w.eid and e.salary>89000
group by e.eid,e.ename,e.salary

select*
from emp_Info
drop view emp_Info

--update the view
update emp_Info
set ETIME=95
where EID

select *
from works
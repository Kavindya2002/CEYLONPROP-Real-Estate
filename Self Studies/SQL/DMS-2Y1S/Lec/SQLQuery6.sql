create table employee(
id int primary key,
name varchar(30)
)
select *
from employee
declare @count
int 
set @count=1
while @count<=100
begin
insert into employee
values(@count,CONCAT('employee',@count))
set @count=@count+1
end
--create a function that returns the number of emplyees in a given department
create function getEmpCount (@deptName varchar (30))
returns int
as
begin 
declare @ecount int
select @ecount=count(eid)
from works
where did=@deptName
return @ecount
end

--calling the function
declare @result int
exec @result=getEmpCount 'ITSD'
print @result


create function getTotalTime(@empId int) returns int
as
begin
declare @total int
select @total =sum(pct_time)
from works
where eid=@empId
return @total
end
declare @r int
exec @r=getTotalTime 1000
print @r

select *
from works
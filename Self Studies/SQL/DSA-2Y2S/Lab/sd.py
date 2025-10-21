def insertionSort(A):
    for j in range(1,len(A)):
        key=A[j]
        i=j-1

        while i>0 and A[i]>key:
            A[i+1]=A[i]
            i=i-1
        A[i+1]=key

def findRange(A):
    range=A[-1]-A[0]
    return range

def findMedian(A):
    if(len(A)%2==0):
        median=(A[len(A)//2]+A[(len(A)//2)-1])/2

    else:
        median=(A[len(A)//2])
        return median
A=[]

for i in range(9):
    num=int(input("Enter no : "))
    A.append(num)

    

print("Before",A)
insertionSort(A)
print("Range",findRange(A))
print("Median",findMedian(A))

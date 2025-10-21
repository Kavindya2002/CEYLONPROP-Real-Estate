

def bubbleSort(A):
    for i in range(len(A)):
        for j in range(i+1,len(A)):
            if A[i]>A[j]:
                A[i],A[j]=A[j],A[i]

A=[]
print("Before sort : ",A)
bubbleSort(A)
print("After Sort : ",A)

for i in range(5):
    noo=int(input("no"))
    A.append(noo)

print("before",A)
bubbleSort(A)
print("After",A)

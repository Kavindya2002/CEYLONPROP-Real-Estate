A=[]
for v in range(10):
    A.append(input('Enter a number: '))
print (A)

def insertsort(A):
    for j in range(1,len(A)):
        key = A[j]
        i=j-1
        while (i>0 and A[i]>key):
            A[i+1]=A[i]
            i=i-1
        A[i+1]=key

insertsort(A)
print('Sorted Array')
for x in range(len(A)):
    print(A[x])

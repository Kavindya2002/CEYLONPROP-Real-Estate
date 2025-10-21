arr = []
for v in range(7):
    arr.append(int(input('Enter number: ')))

# Print the unsorted array
print("Unsorted array:", arr)

def selection_sort(arr):
    n = len(arr)  # Get the length of the array
    for j in range(n - 1):  # Loop through each element except the last
        smallest = j  # Assume the current position is the smallest
        for i in range(j + 1, n):  # Look for the smallest element in the remaining unsorted part
            if arr[i] < arr[smallest]:  # If a smaller element is found
                smallest = i  # Update the index of the smallest element
        # Swap the found smallest element with the first element of the unsorted part
        arr[j], arr[smallest] = arr[smallest], arr[j]

selection_sort(arr)

# Print the sorted array
print("Sorted array using Selection Sort:")
for num in arr:
    print(num)

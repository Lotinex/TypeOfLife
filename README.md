# Type Of Life
Conway's Game of Life implementation with TypeScript's type system.


# Preview
![image](https://user-images.githubusercontent.com/34784356/221182068-b577f994-2559-43da-9ebf-a75ee02de08c.png)
# Important note

When the world is updated over multiple ticks, **off-screen cells are not considered alive** if the whole pattern is too large.   
Therefore, large pattern can change the shape of the next tick in an unexpected direction.

I will expand the size of the world within the time-complexity limit that TypeScript's type system can withstand while improving the calculation to include cells up to a certain distance off the screen.


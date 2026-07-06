% Cargar los hechos
:- [hechos].

% Regla 1: Buscar productos que no excedan el presupuesto
consultar_por_precio(MaxPrecio, Nombre) :-
    producto(_, Nombre, Precio, _, _),
    Precio =< MaxPrecio.

% Regla 2: Recomendación experta (Precio y Espacio en casa)
recomendar_ideal(MaxPrecio, MaxAncho, Nombre) :-
    producto(_, Nombre, Precio, _, Ancho),
    Precio =< MaxPrecio,
    Ancho =< MaxAncho.
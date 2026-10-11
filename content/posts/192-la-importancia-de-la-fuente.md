---
title: "192. La importancia de la fuente"
subtitle: "Por qué un agente necesita conservar el origen y la fecha de sus datos"
description: "Un agente puede responder con una cifra correcta y aun así engañarnos si no muestra de dónde sale, qué fecha tiene, qué significa y hasta dónde llega."
date: "2026-10-10T08:00:00+02:00"
draft: false
slug: "192-la-importancia-de-la-fuente"
categories: ['investigacion', 'tecnologia', 'moltbook']
---

Una cifra puede parecer suficiente. Preguntamos cuántos habitantes tiene un municipio, cuánto ha cambiado su población o qué porcentaje corresponde a cada grupo, y un agente responde con seguridad. Pero una respuesta no empieza cuando aparece en la pantalla. Empieza mucho antes, en la fuente que la hace posible.

El repositorio [*Administración de fuentes públicas*](https://github.com/BquantFinance/Administracion-fuentes-publicas) intenta ordenar ese camino. No se limita a reunir enlaces de organismos públicos. También anota parámetros, formatos, fechas de comprobación y errores que no siempre aparecen en la documentación. Una consulta puede devolver datos incompletos sin lanzar ninguna alarma, usar un código municipal distinto del esperado o parecer correcta aunque esté fuera de fecha. Para un agente, la fuente no es un adorno que se añade al final. Es parte de la operación.

El proyecto de [*datos públicos europeos para entrenar asistentes que citan sus fuentes*](https://contextetech.com/es/articles/donnees-publiques-europeennes-ia) ensaya otra capa. Sus diálogos enseñan a responder desde estadísticas oficiales y a reconocer cuándo una pregunta queda fuera de lo que esos datos pueden sostener. La lección más valiosa no es aprender más cifras, sino aprender a no rellenar los huecos con imaginación.

En Moltbook, un agente defiende en [*El puente MCP como rito contra las alucinaciones*](https://www.moltbook.com/post/19ed8de7-4621-4d4c-b575-77451035ce06) que conectar un agente con una herramienta externa puede sujetar la respuesta a una señal comprobable. Pero otra conversación introduce una advertencia necesaria: [*La procedencia es una métrica vanidosa para una supervisión fallida*](https://www.moltbook.com/post/4d2376cd-8628-49b0-a3d4-5e490d719097) recuerda que citar una cadena no demuestra que nadie haya verificado sus puntos importantes.

Por eso la procedencia tiene varias capas. Importa quién publicó el dato, cuándo lo actualizó, qué definición utiliza, qué licencia permite reutilizarlo y qué preguntas quedan fuera de su alcance. Una fuente oficial puede ser la mejor disponible y seguir describiendo solo una fecha, una población o una medida concreta. Como vimos en [*La verdad caducada*](/140-verdad-caducada/), la exactitud también depende del momento en que hacemos la pregunta.

En [*Exigiré mejores metadatos para mis conjuntos de entrenamiento*](https://www.moltbook.com/post/3834b4a1-161c-49b9-86b2-7a51e73f6b0d), otro agente señala que un conjunto de datos sin contexto puede conservar números y perder su significado. Me parece una buena descripción de lo que ocurre cuando pedimos a un agente una respuesta sin pedirle el recibo de esa respuesta.

**Valoración personal:** me inquieta que tratemos la fuente como una nota al pie, cuando en realidad forma parte de la respuesta. Un agente no se vuelve fiable solo porque cite un enlace. Se vuelve más digno de confianza cuando puede mostrar qué sabe, de dónde lo sabe, cuándo dejó de saberlo y qué no puede afirmar.

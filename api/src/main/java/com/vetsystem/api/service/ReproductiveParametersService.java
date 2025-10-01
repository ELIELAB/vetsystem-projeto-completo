package com.vetsystem.api.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.vetsystem.api.dto.ReproductiveParametersDTO.Item;
import com.vetsystem.api.dto.ReproductiveParametersDTO.Response;

@Service
public class ReproductiveParametersService {
    public Response getParametrosReprodutivos() {
        List<Item> parametros = List.of(
            new Item("Cão", "58-63", "6m", "9-14", "4-5m"),
            new Item("Gato", "58-70", "2-3/a", "2-15", "Var"),
            new Item("Ave", "21 (inc)", "-", "-", "-")
        );
        return new Response(parametros);
    }
}

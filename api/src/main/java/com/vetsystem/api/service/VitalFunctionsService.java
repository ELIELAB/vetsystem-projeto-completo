package com.vetsystem.api.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.vetsystem.api.dto.VitalFunctionsDTO.Item;
import com.vetsystem.api.dto.VitalFunctionsDTO.Response;

@Service
public class VitalFunctionsService {
    public Response getFuncoesVitais() {
        List<Item> funcoes = List.of(
            new Item("t °C", "37,5° - 39,3°", "38,0° - 39,5°", "°C"),
            new Item("FC - rec-nsc.", "até 180", "220 - 260", "bpm"),
            new Item("FC - adultos", "70 - 160", "120 - 200", "bpm"),
            new Item("FC - gigantes", "70 - 140", "-", "bpm"), // Gatos não têm categoria "gigante"
            new Item("FR", "10 - 30", "20 - 40", "mrm")
        );
        return new Response(funcoes);
    }
}

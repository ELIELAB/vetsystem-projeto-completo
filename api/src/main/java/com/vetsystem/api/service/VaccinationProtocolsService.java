package com.vetsystem.api.service;

import com.vetsystem.api.dto.VaccinationProtocolsDTO;
import com.vetsystem.api.dto.VaccinationProtocolsDTO.ProtocolItem;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VaccinationProtocolsService {

    public VaccinationProtocolsDTO getProtocols() {
        List<ProtocolItem> caes = List.of(
            new ProtocolItem("Vermífugo", "X (30 dias)", "A cada 30 dias até 6 meses", "", ""),
            new ProtocolItem("Anti Pulgas", "X", "A cada mês, dependendo", "", ""),
            new ProtocolItem("V8 - V10", "X", "X", "X", "X"),
            new ProtocolItem("Bordetella sp. (Tosse)", "", "X", "X", "X"),
            new ProtocolItem("Giardíase", "", "X", "X", "X"),
            new ProtocolItem("Antirrábica", "", "", "X (a partir de 4 meses)", "X"),
            new ProtocolItem("Leishtec", "", "X (a partir de 4 meses)", "X", "X")
        );

        List<ProtocolItem> gatos = List.of(
            new ProtocolItem("Vermífugo", "X (30 dias)", "A cada 30 dias até 6 meses", "", ""),
            new ProtocolItem("Anti Pulgas", "X", "A cada mês, dependendo", "", ""),
            new ProtocolItem("V4 - V5", "X", "X", "X", "X"),
            new ProtocolItem("Antirrábica", "", "", "X (a partir de 4 meses)", "X")
        );

        return new VaccinationProtocolsDTO(caes, gatos);
    }
}

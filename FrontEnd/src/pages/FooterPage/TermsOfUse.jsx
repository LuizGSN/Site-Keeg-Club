import styled from 'styled-components';
import { theme } from '../../GlobalStyles';

const Container = styled.div`
  max-width: ${theme.sizes.maxWidth};
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const Title = styled.h1`
  font-family: ${theme.fonts.secondary};
  font-size: ${theme.fontSizes.xxlarge};
  color: ${theme.colors.primary};
  text-align: center;
  margin-bottom: 2rem;
`;

const Subtitle = styled.h2`
  font-family: ${theme.fonts.secondary};
  font-size: ${theme.fontSizes.xlarge};
  color: ${theme.colors.primary};
  margin-top: 2rem;
  margin-bottom: 1rem;
`;

const Text = styled.p`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.medium};
  color: ${theme.colors.text};
  line-height: 1.8;
  text-align: justify;
  margin-bottom: 1.5rem;
`;

const List = styled.ul`
  font-family: ${theme.fonts.primary};
  font-size: ${theme.fontSizes.medium};
  color: ${theme.colors.text};
  line-height: 1.8;
  margin-bottom: 1.5rem;
  padding-left: 2rem;

  li {
    margin-bottom: 0.5rem;
  }
`;

export const TermsOfUse = () => {
  return (
    <Container>
      <Title>Termos de Uso</Title>

      <Subtitle>1. Termos</Subtitle>
      <Text>
        Ao acessar o site Keeg Club, você concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis. Se você não concordar com algum desses termos, está proibido de usar ou acessar este site. Os materiais contidos neste site são protegidos pelas leis de direitos autorais e marcas comerciais aplicáveis.
      </Text>

      <Subtitle>2. Uso de Licença</Subtitle>
      <Text>
        É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site Keeg Club, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título e, sob esta licença, você não pode:
      </Text>
      <List>
        <li>Modificar ou copiar os materiais;</li>
        <li>Usar os materiais para qualquer finalidade comercial ou para exibição pública (comercial ou não comercial);</li>
        <li>Tentar descompilar ou fazer engenharia reversa de qualquer software contido no site Keeg Club;</li>
        <li>Remover quaisquer direitos autorais ou outras notações de propriedade dos materiais;</li>
        <li>Transferir os materiais para outra pessoa ou "espelhar" os materiais em qualquer outro servidor.</li>
      </List>
      <Text>
        Esta licença será automaticamente rescindida se você violar alguma dessas restrições e poderá ser rescindida por Keeg Club a qualquer momento. Ao encerrar a visualização desses materiais ou após o término desta licença, você deve apagar todos os materiais baixados em sua posse, seja em formato eletrônico ou impresso.
      </Text>

      <Subtitle>3. Isenção de Responsabilidade</Subtitle>
      <Text>
        Os materiais no site da Keeg Club são fornecidos "como estão". Keeg Club não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização, adequação a um fim específico ou não violação de propriedade intelectual ou outra violação de direitos.
      </Text>
      <Text>
        Além disso, o Keeg Club não garante ou faz qualquer representação relativa à precisão, aos resultados prováveis ou à confiabilidade do uso dos materiais em seu site ou de outra forma relacionado a esses materiais ou em sites vinculados a este site.
      </Text>

      <Subtitle>4. Limitações</Subtitle>
      <Text>
        Em nenhum caso o Keeg Club ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais no Keeg Club, mesmo que Keeg Club ou um representante autorizado da Keeg Club tenha sido notificado oralmente ou por escrito da possibilidade de tais danos. Como algumas jurisdições não permitem limitações em garantias implícitas, ou limitações de responsabilidade por danos consequentes ou incidentais, essas limitações podem não se aplicar a você.
      </Text>

      <Subtitle>5. Precisão dos Materiais</Subtitle>
      <Text>
        Os materiais exibidos no site da Keeg Club podem incluir erros técnicos, tipográficos ou fotográficos. Keeg Club não garante que qualquer material em seu site seja preciso, completo ou atual. Keeg Club pode fazer alterações nos materiais contidos em seu site a qualquer momento, sem aviso prévio. No entanto, Keeg Club não se compromete a atualizar os materiais.
      </Text>

      <Subtitle>6. Links</Subtitle>
      <Text>
        O Keeg Club não analisou todos os sites vinculados ao seu site e não é responsável pelo conteúdo de nenhum site vinculado. A inclusão de qualquer link não implica endosso por Keeg Club do site. O uso de qualquer site vinculado é por conta e risco do usuário.
      </Text>

      <Subtitle>Modificações</Subtitle>
      <Text>
        O Keeg Club pode revisar estes termos de serviço do site a qualquer momento, sem aviso prévio. Ao usar este site, você concorda em ficar vinculado à versão atual desses termos de serviço.
      </Text>

      <Subtitle>Lei Aplicável</Subtitle>
      <Text>
        Estes termos e condições são regidos e interpretados de acordo com as leis do Keeg Club, e você se submete irrevogavelmente à jurisdição exclusiva dos tribunais naquele estado ou localidade.
      </Text>
    </Container>
  );
};
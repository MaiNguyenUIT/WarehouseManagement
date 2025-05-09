import ADto from './ADto';

export default class ReportDTO extends ADto {
    id;
    title;
    description;
    createdAt;
    status;
    reportPriority;
    userName;

    constructor(data) {
        super(data);
        ADto.fill(data, this);
    }
}
